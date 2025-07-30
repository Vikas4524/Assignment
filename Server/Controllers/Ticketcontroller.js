const Ticket = require('./ticket.model');

// Regular User
module.exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(ticket);
  } catch (err) { next(err); }
};

// User: get their own tickets
module.exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.json(tickets);
  } catch (err) { next(err); }
};

// Agent, Admin
module.exports.getAllTickets = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, status, priority, search } = req.query;
    page = parseInt(page); limit = parseInt(limit);
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const tickets = await Ticket.find(filter)
      .skip((page - 1) * limit).limit(limit)
      .populate('createdBy', 'name email');
    const count = await Ticket.countDocuments(filter);
    res.json({ tickets, total: count });
  } catch (err) { next(err); }
};

// Get single ticket (User: only own, Agent: any)
module.exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (req.user.role === 'user' && !ticket.createdBy.equals(req.user._id))
      return res.status(403).json({ message: 'Not allowed' });
    res.json(ticket);
  } catch (err) { next(err); }
};

// Update ticket (User: own, Agent: any)
module.exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'user' && !ticket.createdBy.equals(req.user._id))
      return res.status(403).json({ message: 'Not allowed' });
    Object.assign(ticket, req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) { next(err); }
};

// Delete ticket (User: own, Agent: any)
module.exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'user' && !ticket.createdBy.equals(req.user._id))
      return res.status(403).json({ message: 'Not allowed' });
    await ticket.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};