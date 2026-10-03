using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.ProjectMember;
public class ProjectMemberCreateDto
{
    [Required]
    public int ProjectId { get; set; }

    [Required]
    public int UserId { get; set; }

    [MaxLength(100)]
    public string RoliNeProjekt { get; set; } = "Anetar";
}