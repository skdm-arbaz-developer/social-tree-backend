import { User, ClientInfo, SocialMedia } from '../models/index.js';

export const getPublicProfile = async (req, res) => {
  try {
    const { unique_id } = req.params;

    const clientInfo = await ClientInfo.findOne({
      where: { unique_id },
      include: [{
        model: User,
        attributes: ['name', 'profile_image'],
        include: [{
          model: SocialMedia,
          attributes: ['id', 'platform', 'url', 'icon_url']
        }]
      }]
    });

    if (!clientInfo) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Format response to match previous frontend expectations
    const response = {
      business_name: clientInfo.business_name,
      business_email: clientInfo.business_email,
      business_phone: clientInfo.business_phone,
      summary: clientInfo.summary,
      logo_url: clientInfo.logo,
      banner_url: clientInfo.banner,
      SocialMedia: clientInfo.User ? clientInfo.User.SocialMedia : [],
      name: clientInfo.User ? clientInfo.User.name : '',
      profile_image: clientInfo.User ? clientInfo.User.profile_image : ''
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
