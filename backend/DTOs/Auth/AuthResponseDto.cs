using backend.DTOs.Users;

namespace backend.DTOs.Auth;
public class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserReadDto User { get; set; } = null!;
}