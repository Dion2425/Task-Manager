namespace backend.Models.Identity;
public class Task
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Titulli { get; set; } = string.Empty;
        public string Pershkrimi { get; set; } = string.Empty;
        public string Prioriteti { get; set; } = "Mesatar";
        public string Statusi { get; set; } = "NeBerje";
        public int? AssignedTo { get; set; }
        public DateTime? DataAfatit { get; set; }
 
        public Project Project { get; set; } = null!;
        public User? PerdoruesiCaktuar { get; set; }
        public ICollection<TaskComment> Komentet { get; set; } = new List<TaskComment>();
        public ICollection<TaskAttachment> Bashkangjitjet { get; set; } = new List<TaskAttachment>();
        public ICollection<TaskLabel> Etiketat { get; set; } = new List<TaskLabel>();
    }