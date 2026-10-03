namespace backend.Models.Identity;

public class UserToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string LoginProvider { get; set; } = string.Empty;
        public string TokenName { get; set; } = string.Empty;
        public string TokenValue { get; set; } = string.Empty;
 
        public User User { get; set; } = null!;
    }