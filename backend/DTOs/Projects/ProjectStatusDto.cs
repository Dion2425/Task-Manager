using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Projects;

public class ProjectStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Statusi { get; set; } = string.Empty;
}