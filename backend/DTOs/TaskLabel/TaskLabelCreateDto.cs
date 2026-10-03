using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.TaskLabel;
public class TaskLabelCreateDto
{
    [Required]
    public int TaskId { get; set; }

    [Required]
    public int LabelId { get; set; }
}