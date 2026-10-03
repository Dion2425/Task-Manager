using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Users;
public class UserUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Emri { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Mbiemri { get; set; } = string.Empty;

    [Phone]
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    public bool Statusi { get; set; } = true;

    public List<int> RoleIds { get; set; } = new();
}