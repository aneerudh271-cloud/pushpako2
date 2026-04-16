import mongoose from "mongoose"

const SubmissionSchema = new mongoose.Schema(
    {
        participation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participation",
            required: true
        },
        markdownFile: { type: String }, // URL or path to uploaded file
        githubRepo: { type: String },
        demoLink: { type: String },
        status: {
            type: String,
            enum: ['PENDING', 'REVIEWED', 'SELECTED'],
            default: 'PENDING'
        },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
)

// Add indexes
SubmissionSchema.index({ participation: 1 }, { unique: true }) // One submission per participation

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema)