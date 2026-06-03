import bcrypt from 'bcrypt';
import { User, ClientInfo } from '../models/index.js';

export const createClient = async (req, res) => {
  try {
    const { username, email, phone, name, password, business_name, business_email, business_phone, unique_id } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    
    const existingId = await ClientInfo.findOne({ where: { unique_id } });
    if (existingId) return res.status(400).json({ message: 'Unique ID already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phone,
      name,
      password: hashedPassword,
      role: 'client'
    });

    const clientInfo = await ClientInfo.create({
      user_id: user.id,
      business_name,
      business_email,
      business_phone,
      unique_id
    });

    res.status(201).json({ message: 'Client created successfully', client: { id: user.id, username: user.username, unique_id: clientInfo.unique_id } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await User.findAll({
      where: { role: 'client' },
      attributes: { exclude: ['password'] },
      include: [{ model: ClientInfo }]
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: ClientInfo }]
    });
    if (!user) return res.status(404).json({ message: 'Client not found' });
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const userData = user.toJSON();
    
    if (userData.profile_image) userData.profile_image = `${baseUrl}${userData.profile_image}`;
    if (userData.ClientInfo) {
      if (userData.ClientInfo.logo) userData.ClientInfo.logo = `${baseUrl}${userData.ClientInfo.logo}`;
      if (userData.ClientInfo.banner) userData.ClientInfo.banner = `${baseUrl}${userData.ClientInfo.banner}`;
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, business_name, business_email, business_phone, summary } = req.body;
    
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    if (req.files && req.files.profile_image) {
      user.profile_image = `/uploads/${req.files.profile_image[0].filename}`;
    }

    await user.save();

    let clientInfo = await ClientInfo.findOne({ where: { user_id: req.userId } });
    if (clientInfo) {
      if (business_name) clientInfo.business_name = business_name;
      if (business_email) clientInfo.business_email = business_email;
      if (business_phone) clientInfo.business_phone = business_phone;
      if (summary) clientInfo.summary = summary;

      if (req.files) {
        if (req.files.logo) {
          clientInfo.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.banner) {
          clientInfo.banner = `/uploads/${req.files.banner[0].filename}`;
        }
      }
      await clientInfo.save();
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.is_active = is_active;
    await user.save();
    res.status(200).json({ message: `Client status updated to ${is_active ? 'Active' : 'Inactive'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClientByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, business_name, business_email, business_phone, unique_id, username } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (username) user.username = username;

    await user.save();

    let clientInfo = await ClientInfo.findOne({ where: { user_id: id } });
    if (clientInfo) {
      if (business_name) clientInfo.business_name = business_name;
      if (business_email) clientInfo.business_email = business_email;
      if (business_phone) clientInfo.business_phone = business_phone;
      if (unique_id) clientInfo.unique_id = unique_id;

      await clientInfo.save();
    }

    res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
