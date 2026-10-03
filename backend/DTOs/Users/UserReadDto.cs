namespace backend.DTOs.Users;
public class UserReadDto
{
    public int Id { get; set; }
    public string Emri { get; set; } = string.Empty;
    public string Mbiemri { get; set; } = string.Empty;
    public string EmriPlote => $"{Emri} {Mbiemri}";
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool LockoutEnabled { get; set; }
    public DateTime DataKrijimit { get; set; }
    public bool Statusi { get; set; }
    public List<string> Rolet { get; set; } = new();
    public List<int> RoleIds { get; set; } = new();
}