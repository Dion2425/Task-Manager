using backend.Models.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<UserClaim> UserClaims { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectMember> ProjectMembers { get; set; }
    public DbSet<Models.Identity.Task> Tasks { get; set; }
    public DbSet<TaskComment> TaskComments { get; set; }
    public DbSet<TaskAttachment> TaskAttachments { get; set; }
    public DbSet<Label> Labels { get; set; }
    public DbSet<TaskLabel> TaskLabels { get; set; }
    public DbSet<Sprint> Sprints { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Users ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Emri).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Mbiemri).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.PhoneNumber).HasMaxLength(20);
            entity.Property(u => u.Statusi).HasDefaultValue(true);
            entity.Property(u => u.DataKrijimit).HasDefaultValueSql("NOW()");
        });

        // ── Roles ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Emertimi).IsRequired().HasMaxLength(100);
            entity.HasIndex(r => r.NormalizedName).IsUnique();
            entity.Property(r => r.NormalizedName).IsRequired().HasMaxLength(100);
            entity.Property(r => r.Pershkrimi).HasMaxLength(500);
        });

        // ── UserRoles (Many-to-Many) ──────────────────────────────────────────
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("UserRoles");
            entity.HasKey(ur => ur.Id);

            // Lidhja me User (Many-to-One)
            entity.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            // Lidhja me Role (Many-to-One)
            entity.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);

            // Nje perdorues nuk mund te kete dy here te njejtin rol
            entity.HasIndex(ur => new { ur.UserId, ur.RoleId }).IsUnique();
        });

        // ── UserClaims ────────────────────────────────────────────────────────
        modelBuilder.Entity<UserClaim>(entity =>
        {
            entity.ToTable("UserClaims");
            entity.HasKey(uc => uc.Id);
            entity.Property(uc => uc.ClaimType).IsRequired().HasMaxLength(200);
            entity.Property(uc => uc.ClaimValue).IsRequired().HasMaxLength(500);

            entity.HasOne(uc => uc.User)
                    .WithMany(u => u.UserClaims)
                    .HasForeignKey(uc => uc.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        // ── UserTokens ────────────────────────────────────────────────────────
        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.ToTable("UserTokens");
            entity.HasKey(ut => ut.Id);
            entity.Property(ut => ut.LoginProvider).IsRequired().HasMaxLength(200);
            entity.Property(ut => ut.TokenName).IsRequired().HasMaxLength(200);
            entity.Property(ut => ut.TokenValue).IsRequired();

            entity.HasOne(ut => ut.User)
                    .WithMany(u => u.UserTokens)
                    .HasForeignKey(ut => ut.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        // ── RefreshTokens ─────────────────────────────────────────────────────
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.ToTable("RefreshTokens");
            entity.HasKey(rt => rt.Id);
            entity.Property(rt => rt.Token).IsRequired().HasMaxLength(500);
            entity.Ignore(rt => rt.IsExpired);
            entity.Ignore(rt => rt.IsRevoked);
            entity.Ignore(rt => rt.IsActive);

            entity.HasOne(rt => rt.User)
                    .WithMany(u => u.RefreshTokens)
                    .HasForeignKey(rt => rt.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.ToTable("Projects");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Emertimi).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Pershkrimi).IsRequired().HasMaxLength(1000);
            entity.Property(p => p.DataFillimit).HasDefaultValueSql("NOW()");
            entity.Property(p => p.Statusi).IsRequired().HasMaxLength(50);
            entity.HasOne(p => p.Owner)
                    .WithMany(u => u.OwnedProjects)
                    .HasForeignKey(p => p.OwnerId)
                    .OnDelete(DeleteBehavior.Restrict);

        });

        modelBuilder.Entity<ProjectMember>(entity =>
        {
            entity.ToTable("ProjectMembers");
            entity.HasKey(pm => pm.Id);
            entity.Property(pm => pm.RoliNeProjekt).IsRequired().HasMaxLength(100).HasDefaultValue("Anetar");
            entity.HasOne(pm => pm.User)
                    .WithMany(u => u.ProjectMembers)
                    .HasForeignKey(pm => pm.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pm => pm.Project)
                    .WithMany(p => p.Anetaret)
                    .HasForeignKey(pm => pm.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(pm => new { pm.ProjectId, pm.UserId}).IsUnique();
        });

        modelBuilder.Entity<Models.Identity.Task>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Titulli).IsRequired().HasMaxLength(300);
            entity.Property(t => t.Pershkrimi).IsRequired().HasMaxLength(2000);
            entity.Property(t => t.Prioriteti).IsRequired().HasMaxLength(50).HasDefaultValue("Mesatar");
            entity.Property(t => t.Statusi).IsRequired().HasMaxLength(50).HasDefaultValue("NeBerje");
            entity.HasOne(t => t.Project)
                    .WithMany(p => p.Detyrat)
                    .HasForeignKey(t => t.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(t => t.PerdoruesiCaktuar)
                    .WithMany(p => p.AssignedTasks)
                    .HasForeignKey(t => t.AssignedTo)
                    .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TaskComment>(entity =>
        {
            entity.ToTable("TaskComments");
            entity.HasKey(tc => tc.Id);
            entity.Property(tc => tc.Komenti).IsRequired().HasMaxLength(2000);
            entity.HasOne(tc => tc.Task)
                    .WithMany(t => t.Komentet)
                    .HasForeignKey(tc => tc.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(tc => tc.User)
                    .WithMany(t => t.TaskComments)
                    .HasForeignKey(tc => tc.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TaskAttachment>(entity =>
        {
            entity.ToTable("TaskAttachments");
            entity.HasKey(ta => ta.Id);
            entity.Property(ta => ta.EmriSkedarit).IsRequired().HasMaxLength(255);
            entity.Property(ta => ta.Rruga).IsRequired().HasMaxLength(500);
            entity.HasOne(ta => ta.Task)
                    .WithMany(t => t.Bashkangjitjet)
                    .HasForeignKey(ta => ta.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Label>(entity =>
        {
            entity.ToTable("Labels");
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Emertimi).IsRequired().HasMaxLength(100);
            entity.Property(l => l.Ngjyra).IsRequired().HasMaxLength(20).HasDefaultValue("#000000");
        });

        modelBuilder.Entity<TaskLabel>(entity =>
        {
            entity.ToTable("TaskLabels");
            entity.HasKey(tl => tl.Id);
            entity.HasOne(tl => tl.Task)
                    .WithMany(t => t.Etiketat)
                    .HasForeignKey(tl => tl.TaskId)
                    .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(tl => tl.Label)
                    .WithMany(t => t.TaskLabels)
                    .HasForeignKey(tl => tl.LabelId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Sprint>(entity =>
        {
            entity.ToTable("Sprints");
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Emertimi).IsRequired().HasMaxLength(200);
            entity.Property(s => s.Statusi).HasMaxLength(50).HasDefaultValue("Planifikuar");
            entity.HasOne(s => s.Project)
                    .WithMany(p => p.Sprintet)
                    .HasForeignKey(s => s.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.ToTable("ActivityLogs");
            entity.HasKey(al => al.Id);
            entity.Property(al => al.Veprimi).IsRequired().HasMaxLength(100);
            entity.Property(al => al.Pershkrimi).HasMaxLength(500);
            entity.HasOne(al => al.Project)
                    .WithMany(p => p.AktivitetetLog)
                    .HasForeignKey(al => al.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(al => al.User)
                    .WithMany(p => p.ActivityLogs)
                    .HasForeignKey(al => al.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Seed Data: Role-t fillestare ──────────────────────────────────────
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Emertimi = "Admin",     NormalizedName = "ADMIN",     Pershkrimi = "Administrator i sistemit" },
            new Role { Id = 2, Emertimi = "Menaxher",  NormalizedName = "MENAXHER",  Pershkrimi = "Menaxher i departamentit" },
            new Role { Id = 3, Emertimi = "Perdorues", NormalizedName = "PERDORUES", Pershkrimi = "Perdorues i zakonshëm" }
        );

    }
}