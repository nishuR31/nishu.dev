export async function getGithubRepos(username: string) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        next: { revalidate: 3600, tags: ["github-projects"] },
        headers: { Accept: "application/vnd.github+json" },
      },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch Github repos:", error);
    return [];
  }
}
