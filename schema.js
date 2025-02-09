const joi=require("joi")
module.exports.listingschema=joi.object(
    {
        listing:joi.object({
            tittle:joi.string().required(),
            description:joi.string().required(),
            country:joi.string().required(),
            location:joi.string().required(),
            price:joi.number().required().min(0),
            image:joi.string().allow("",null),
            category:joi.string().required(),

        }).required()
    }
)

module.exports.reviewsschema=joi.object({
    reviews:joi.object({
        rating:joi.number().required().min(1).max(10),
        comment:joi.string().required(),
    }).required(),
});
