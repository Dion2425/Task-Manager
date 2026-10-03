using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.ProjectMember;
public class ProjectMemberUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string RoliNeProjekt { get; set; } = string.Empty;
}