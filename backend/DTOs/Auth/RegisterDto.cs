using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;
public class RegisterDto
{
    [Required]
    [MaxLength(100)]
    public string Emri { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Mbiemri { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password", ErrorMessage = "Fjalekalimet nuk perputhen")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }
}