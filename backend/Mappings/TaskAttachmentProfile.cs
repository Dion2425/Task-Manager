using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.TaskAttachment;

namespace backend.Mappings;
public class TaskAttachmentProfile : Profile
{
    public TaskAttachmentProfile()
    {
        CreateMap<TaskAttachmentCreateDto, TaskAttachment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.DataNgarkimit, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<TaskAttachment, TaskAttachmentReadDto>();
    }
}