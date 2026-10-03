using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;
public class LoginDto
{
    [Required(ErrorMessage = "Email-i eshte i detyrueshem")]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fjalekalimi eshte i detyrueshem")]
    public string Password { get; set; } = string.Empty;
}