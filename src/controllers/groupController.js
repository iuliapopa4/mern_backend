const { validationResult } = require('express-validator');
const Group = require('../models/groupModel');

const createGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, members } = req.body;

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

    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members.push(memberId);
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

    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members = group.members.filter((member) => member.toString() !== memberId);
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
  createGroup,
  getGroups,
  getGroupById,
  addGroupMember,
  removeGroupMember,
  updateGroup,
  deleteGroup,
};
