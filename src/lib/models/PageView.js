import mongoose from 'mongoose';

const PageViewSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    uniqueVisitors: {
        type: Number,
        default: 0
    },
    lastVisited: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export default mongoose.models.PageView || mongoose.model('PageView', PageViewSchema);
