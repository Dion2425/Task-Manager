using AutoMapper;
using backend.Models.Identity;
using backend.DTOs.Label;

namespace backend.Mappings;
public class LabelProfile : Profile
{
    public LabelProfile()
    {
        CreateMap<LabelCreateDto, Label>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<LabelUpdateDto, Label>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<Label, LabelReadDto>();
    }
}