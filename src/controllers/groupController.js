const { validationResult } = require('express-validator');
const Group = require('../models/groupModel');

const checkMembersExist = async (members) => {
  const existingEmails = [];
  const nonExistingEmails = [];

  for (const email of members) {
    const user = await User.findOne({ email });
    if (user) {
      existingEmails.push(email);
    } else {
      nonExistingEmails.push(email);
    }
  }

  return { existingEmails, nonExistingEmails };
};

const createGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, members } = req.body;

    if (!req.userRole.includes('admin')) {
      return res.status(403).json({ message: 'Access denied. Only Admins can create user groups' });
    }

    const { existingEmails, nonExistingEmails } = await checkMembersExist(members);

    if (nonExistingEmails.length > 0) {
      return res.status(400).json({ message: 'Some member emails do not exist', nonExistingEmails });
    }

    const group = new Group({
      name,
      members,
    });

    const savedGroup = await group.save();

    res.status(201).json({ message: 'Group created successfully', group: savedGroup });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
};


const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Failed to get groups' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group by ID error:', error);
    res.status(500).json({ message: 'Failed to get group' });
  }
};

const addGroupMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { groupId, memberEmail } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(memberEmail)) {
      return res.status(400).json({ message: 'Member already exists in the group' });
    }

    group.members.push(memberEmail);
    const updatedGroup = await group.save();

    res.json({ message: 'Group member added successfully', group: updatedGroup });
  } catch (error) {
    console.error('Add group member error:', error);
    res.status(500).json({ message: 'Failed to add group member' });
  }
};

const removeGroupMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { groupId, memberEmail } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(memberEmail)) {
      return res.status(400).json({ message: 'Member does not exist in the group' });
    }

    group.members = group.members.filter((member) => member !== memberEmail);
    const updatedGroup = await group.save();

    res.json({ message: 'Group member removed successfully', group: updatedGroup });
  } catch (error) {
    console.error('Remove group member error:', error);
    res.status(500).json({ message: 'Failed to remove group member' });
  }
};


const updateGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;

    const group = await Group.findByIdAndUpdate(id, { name }, { new: true });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Group updated successfully', group });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ message: 'Failed to update group' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const group = await Group.findByIdAndDelete(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Failed to delete group' });
  }
};

module.exports = {
  checkMembersExist,
  createGroup,
  getGroups,
  getGroupById,
  addGroupMember,
  removeGroupMember,
  updateGroup,
  deleteGroup,
};
