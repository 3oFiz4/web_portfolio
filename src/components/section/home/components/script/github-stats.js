const CACHE_KEY = "github_stat.json";
const pendingRequests = new Map();

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Failed to read cache:", err);
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to write cache:", err);
  }
}

function isSameDay(isoString) {
  if (!isoString) return false;
  return new Date(isoString).toISOString().split("T")[0] === getTodayDate();
}

async function fetchGithubRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (!res.ok) throw new Error("GitHub API failed");

  const user = await res.json();
  return user.public_repos;
}

async function fetchTotalStars(username) {
  let page = 1;
  let totalStars = 0;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
    );

    if (!res.ok) throw new Error("GitHub API failed");

    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) break;

    totalStars += repos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0,
    );

    page++;
  }

  return totalStars;
}

export async function getGithubStats(username) {
  const cache = readCache();

  // Use cache only if:
  // - cache exists
  // - username matches
  // - lastUpdate is still today
  if (cache && cache.username === username && isSameDay(cache.lastUpdate)) {
    return {
      repos: cache.repos,
      stars: cache.stars,
      lastUpdate: cache.lastUpdate,
    };
  }

  // Avoid spam: if same username is already being fetched, reuse it
  if (pendingRequests.has(username)) {
    return pendingRequests.get(username);
  }

  const requestPromise = (async () => {
    try {
      const [repos, stars] = await Promise.all([
        fetchGithubRepos(username),
        fetchTotalStars(username),
      ]);

      const freshData = {
        username,
        repos,
        stars,
        lastUpdate: new Date().toISOString(),
      };

      writeCache(freshData);
      return freshData;
    } catch (err) {
      console.warn("Failed to fetch GitHub stats:", err);

      // fallback to old cache if username matches
      if (cache && cache.username === username) {
        return {
          repos: cache.repos,
          stars: cache.stars,
          lastUpdate: cache.lastUpdate,
        };
      }

      return {
        repos: 12,
        stars: 25,
        lastUpdate: null,
      };
    } finally {
      pendingRequests.delete(username);
    }
  })();

  pendingRequests.set(username, requestPromise);
  return requestPromise;
}

export async function getGithubRepos(username) {
  const stats = await getGithubStats(username);
  return stats.repos;
}

export async function getTotalStars(username) {
  const stats = await getGithubStats(username);
  return stats.stars;
}
