using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.UserRole;
public class UserRoleAssignDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int RoleId { get; set; }
}