using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.TaskAttachment;
public class TaskAttachmentCreateDto
{
    [Required]
    public int TaskId { get; set; }

    [Required(ErrorMessage = "Emri i skedarit eshte i detyrueshem")]
    [MaxLength(255)]
    public string EmriSkedarit { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Rruga { get; set; } = string.Empty;
}