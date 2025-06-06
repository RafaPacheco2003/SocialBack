class ImgDTO {
    constructor(url, post) {
        this.url = url;
        this.post = post;
    }
}

class CreateImgDTO {
    constructor(img) {
        this.url = img.url;
        this.post = img.post;
    }
}


class UpdateImgDTO {
    constructor(img) {
        this.url = img.url;
    }
}


module.exports = { ImgDTO, CreateImgDTO, UpdateImgDTO };