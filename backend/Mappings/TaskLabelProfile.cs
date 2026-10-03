using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.TaskLabel;

namespace backend.Mappings;
public class TaskLabelProfile : Profile
{
    public TaskLabelProfile()
    {
        CreateMap<TaskLabelCreateDto, TaskLabel>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<TaskLabel, TaskLabelReadDto>()
            .ForMember(dest => dest.TitulliDetyres, opt => opt.MapFrom(src => src.Task.Titulli))
            .ForMember(dest => dest.EmriEtiketes, opt => opt.MapFrom(src => src.Label.Emertimi))
            .ForMember(dest => dest.NgjyraEtiketes, opt => opt.MapFrom(src => src.Label.Ngjyra));
    }
}