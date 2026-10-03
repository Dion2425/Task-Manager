using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Token;
public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}