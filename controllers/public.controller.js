import { User, ClientInfo, SocialMedia, Service } from '../models/index.js';

export const getPublicProfile = async (req, res) => {
  try {
    const { unique_id } = req.params;

    const clientInfo = await ClientInfo.findOne({
      where: { unique_id },
      order: [
        [User, Service, 'id', 'ASC']
      ],
      include: [{
        model: User,
        attributes: ['name', 'profile_image'],
        include: [
          {
            model: SocialMedia,
            attributes: ['id', 'platform', 'url', 'icon_url']
          },
          {
            model: Service,
            attributes: ['id', 'service_name', 'short_desc', 'icon']
          }
        ]
      }]
    });

    if (!clientInfo) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Format response to match previous frontend expectations
    const response = {
      business_name: clientInfo.business_name,
      business_email: clientInfo.business_email,
      business_phone: clientInfo.business_phone,
      summary: clientInfo.summary,
      logo_url: clientInfo.logo ? `${baseUrl}${clientInfo.logo}` : null,
      banner_url: clientInfo.banner ? `${baseUrl}${clientInfo.banner}` : null,
      SocialMedia: clientInfo.User ? clientInfo.User.SocialMedia : [],
      Services: clientInfo.User && clientInfo.User.Services ? clientInfo.User.Services : [],
      name: clientInfo.User ? clientInfo.User.name : '',
      profile_image: clientInfo.User && clientInfo.User.profile_image ? `${baseUrl}${clientInfo.User.profile_image}` : ''
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
