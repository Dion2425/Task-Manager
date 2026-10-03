namespace backend.DTOs.TaskLabel;
public class TaskLabelReadDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string TitulliDetyres { get; set; } = string.Empty;
    public int LabelId { get; set; }
    public string EmriEtiketes { get; set; } = string.Empty;
    public string NgjyraEtiketes { get; set; } = string.Empty;
}