using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Users;

public class UserCreateDto
{
    [Required(ErrorMessage = "Emri eshte i detyrueshem")]
    [MaxLength(100)]
    public string Emri { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mbiemri eshte i detyrueshem")]
    [MaxLength(100)]
    public string Mbiemri { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email-i eshte i detyrueshem")]
    [EmailAddress(ErrorMessage = "Formati i email-it eshte i pasakte")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fjalekalimi eshte i detyrueshem")]
    [MinLength(8, ErrorMessage = "Fjalekalimi duhet te kete te pakten 8 karaktere")]
    public string Password { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Numri i telefonit eshte i pasakte")]
    public string? PhoneNumber { get; set; }

    public List<int> RoleIds { get; set; } = new();
}