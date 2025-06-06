const ImgDTO = require('../dtos/img.dto');
const Img = require('../models/img.model');

class ImgMapper {
    static toModel(imgDTO) {
        return new Img(imgDTO.url, imgDTO.post);
    }

    static toDTO(imgModel) {
        return new ImgDTO(imgModel.url, imgModel.post);
    }
}