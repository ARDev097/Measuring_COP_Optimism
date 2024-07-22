import React from 'react';
import '../styles/Instructions.css';
import optimismEmoji from '../assets/OP.jpeg'; // Adjust the path according to where you save the image

const Instructions = ({ showInstructions, handleClose, email, handleEmailChange, handleContinue, emailError }) => {
  if (!showInstructions) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 divouter">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-lg outerdiv">
        <div className="instructiondiv">
          <h2 className="text-xl font-semibold">Instructions 📋</h2>
        </div>
        <div className="p-6">
        <p className="mb-4">
            Welcome to the HCC Influence Analyzer! 🌟 We would like to collect this data to calculate the influence of different Houses, Councils, and Committees (HCC) in the Optimism ecosystem. <img src={optimismEmoji} alt="Optimism" style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }} />
          </p>

          <h5 className="text-lg font-semibold mb-2">Parameters Descriptions:</h5>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Decision Making Authority:</strong> 🏛️ This parameter measures the extent to which a HCC has the power to make binding decisions that affect the governance or operations of Optimism.</li>
            <li><strong>Scope of Influence:</strong> 🌐 This parameter assesses the breadth of the HCC impact within the Optimism ecosystem, including the range of areas or activities they influence.</li>
            <li><strong>Community Engagement:</strong> 🤝 This parameter evaluates how actively the HCC interacts with the community, including gathering feedback, holding public meetings, and providing updates. </li>
            <li><strong>Operational Independence:</strong> 🔄 This parameter measures the degree of autonomy the HCC has in its operations, including budget control, decision-making processes, and procedural oversight.</li>
            <li><strong>Voting Power:</strong> 🗳️ This parameter assesses the extent of voting authority held by the HCC members, including the ability to approve or reject proposals.</li>
            <li><strong>Veto Power:</strong> 🚫 This parameter evaluates whether the HCC has the authority to veto or reject decisions made by other governance bodies.</li>
          </ul>

          <h5 className="text-lg font-semibold mb-2">Getting Started with the HCC Influence Calculator:</h5>
          <ol className="list-decimal pl-5 mb-4">
            <li><strong>Enter Your Email:</strong> 📧 Please provide your email address to proceed. This will allow us to save your configurations and results.</li>
            <li><strong>Set Weights for Parameters:</strong> ⚖️ Adjust the weightage for each of the six parameters. The total weight must add up to 100%.</li>
            <li>
              <strong>Assign Scores:</strong> ⭐ For each HCC, assign a score (0-5) for each parameter based on your assessment.
              <ul className="list-disc pl-5 mb-4 mt-2">
                <li><strong>Score Interpretation:</strong></li>
                <li><strong>0:</strong> 🚫 Indicates no influence or power in the given parameter.</li>
                <li><strong>5:</strong> 💪 Indicates maximum influence or power in the given parameter.</li>
              </ul>
            </li>
            <li><strong>Calculate Shares:</strong> 📊 Once all weights and scores are set, click on the "Calculate Share" button to see the results.</li>
            <li><strong>Review Results:</strong> 📝 The results will display the calculated share percentages for each HCC. You can modify the weights and scores as needed and recalculate.</li>
          </ol>

          <h5 className="text-lg font-semibold mb-2">Example:</h5>
          <p className="mb-4">To help you get started, here's an example configuration:</p>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Weights:</strong> Decision Making Authority (35), Scope of Influence (25), Community Engagement (10), Operational Independence (10), Voting Power (10), Veto Power (5).</li>
            <li><strong>Scores:</strong> (Assign scores based on your evaluation of each HCC).</li>
          </ul>

          <h5 className="text-lg font-semibold mb-2">Enter your Email:</h5>

          <div className="mb-4 inpputdiv">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full p-2 border rounded ${emailError ? 'border-red-500' : 'border-gray-300'}`}
            />
            {emailError && <p className="text-red-500 mt-2 emailerror">{emailError}</p>}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t submitbtn">
          <button
            onClick={handleContinue}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Continue 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
