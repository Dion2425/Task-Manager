using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Token;
public class RevokeTokenDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}