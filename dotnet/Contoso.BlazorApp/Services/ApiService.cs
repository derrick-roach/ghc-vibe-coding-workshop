using Contoso.BlazorApp.Models;

namespace Contoso.BlazorApp.Services;

public class ApiService(HttpClient http)
{
    public Task<List<Post>?> ListPostsAsync() =>
        http.GetFromJsonAsync<List<Post>>("api/posts");

    public Task<Post?> GetPostAsync(string postId) =>
        http.GetFromJsonAsync<Post>($"api/posts/{postId}");

    public async Task<Post?> CreatePostAsync(string username, string content)
    {
        var response = await http.PostAsJsonAsync("api/posts", new { username, content });
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Post>();
    }

    public Task<List<Comment>?> ListCommentsAsync(string postId) =>
        http.GetFromJsonAsync<List<Comment>>($"api/posts/{postId}/comments");

    public async Task<Comment?> CreateCommentAsync(string postId, string username, string content)
    {
        var response = await http.PostAsJsonAsync($"api/posts/{postId}/comments", new { username, content });
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Comment>();
    }

    public async Task LikePostAsync(string postId, string username)
    {
        var response = await http.PostAsJsonAsync($"api/posts/{postId}/likes", new { username });
        response.EnsureSuccessStatusCode();
    }

    public Task UnlikePostAsync(string postId) =>
        http.DeleteAsync($"api/posts/{postId}/likes");
}
