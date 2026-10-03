namespace backend.DTOs.TaskComment;
public class TaskCommentReadDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int UserId { get; set; }
    public string EmriPerdoruesit { get; set; } = string.Empty;
    public string Komenti { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}