namespace backend.Models.Identity;
public class Label
    {
        public int Id { get; set; }
        public string Emertimi { get; set; } = string.Empty;
        public string Ngjyra { get; set; } = "#000000";
 
        public ICollection<TaskLabel> TaskLabels { get; set; } = new List<TaskLabel>();
    }