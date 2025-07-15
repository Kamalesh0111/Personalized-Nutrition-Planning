import React from 'react';

const PlanForm = ({ formData, setFormData, handleSubmit, isLoading }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" className="p-3 border rounded-lg" required />
                    <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" type="number" className="p-3 border rounded-lg" required />
                    <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" type="number" className="p-3 border rounded-lg" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="p-3 border rounded-lg bg-white">
                        <option value="sedentary">Sedentary</option>
                        <option value="active">Active</option>
                    </select>
                    <select name="goal" value={formData.goal} onChange={handleChange} className="p-3 border rounded-lg bg-white">
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                    <select name="diet_preference" value={formData.diet_preference} onChange={handleChange} className="p-3 border rounded-lg bg-white">
                        <option value="non_veg">Non-Vegetarian</option>
                        <option value="veg">Vegetarian</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-400 transition">
                    {isLoading ? 'Generating...' : 'Generate My Plan'}
                </button>
            </form>
        </div>
    );
};

export default PlanForm;