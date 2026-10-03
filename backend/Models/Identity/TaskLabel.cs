namespace backend.Models.Identity;
public class TaskLabel
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int LabelId { get; set; }
 
        public Task Task { get; set; } = null!;
        public Label Label { get; set; } = null!;
    }