using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Tasks;
public class TaskStatusUpdateDto
{
    [Required]
    [MaxLength(50)]
    public string Statusi { get; set; } = string.Empty;
}