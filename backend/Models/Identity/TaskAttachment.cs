namespace backend.Models.Identity;
public class TaskAttachment
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string EmriSkedarit { get; set; } = string.Empty;
        public string Rruga { get; set; } = string.Empty;
        public DateTime DataNgarkimit { get; set; } = DateTime.UtcNow;
 
        public Task Task { get; set; } = null!;
    }