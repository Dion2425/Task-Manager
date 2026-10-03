using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.TaskComment;

namespace backend.Mappings;
public class TaskCommentProfile : Profile
{
    public TaskCommentProfile()
    {
        CreateMap<TaskCommentCreateDto, TaskComment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Data, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<TaskCommentUpdateDto, TaskComment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.TaskId, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Data, opt => opt.Ignore());

        CreateMap<TaskComment, TaskCommentReadDto>()
            .ForMember(dest => dest.EmriPerdoruesit, opt => opt.MapFrom(src => $"{src.User.Emri} {src.User.Mbiemri}"));
    }
}