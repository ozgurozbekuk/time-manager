import User from "../models/user.models.js";
import bcrypt from "bcryptjs";


export const updateMyName = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "fullName is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName: fullName.trim() } },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update name error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePassword = async (req,res) =>{
    try {
        const userId = req.user._id;
        const {currentPassword,newPassword,confirmPassword} = req.body;

        if(!currentPassword || !newPassword || !confirmPassword){
            return res.status(400).json({error:"All password field required!"})
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({error:"New password do not match!"})
        }

        if(newPassword.length < 6){
            return res.status(400).json({error:"Password must be at least 6 characters!"})
        }

        const user =await User.findById(userId).select("+password");
        if(!user){
            return res.status(404).json({error:"User not found!"})
        }

        const isMatch = await bcrypt.compare(currentPassword,user.password)
        if(!isMatch){
            return res.status(400).json({error:"Current password is incorrect"})
        }
        user.password = newPassword;
        user.save();
        res.status(200).json({message:"Password updated successfully!"})
    } catch (error) {
        console.log("Password update error: ",error)
        res.status(500).json({error:"Interval server error!"})
    }
}

export const deleteMe = async (req,res) =>{
    try {
        const userId = req.user._id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser){
            return res.status(404).json({error:"User not found!"})
        }

         res.clearCookie("jwt");

        res.status(200).json({message:"User deleted successfully!"})
    } catch (error) {
        console.log("Delete profile controller error: ",error)
        res.status(500).json({error:"Interval server error!"})
    }
}