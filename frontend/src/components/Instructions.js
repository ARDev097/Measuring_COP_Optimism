import React from "react";
import "../styles/Instructions.css";
import optimismEmoji from "../assets/OP.jpeg"; // Adjust the path according to where you save the image

const Instructions = ({
  showInstructions,
  handleClose,
  email,
  handleEmailChange,
  handleContinue,
  emailError,
}) => {
  if (!showInstructions) return null;
  const parameterDescriptions = [
    {
      icon: "🏛️",
      title: "Decision Making Authority",
      description:
        "This parameter measures the extent to which a HCC has the power to make binding decisions that affect the governance or operations of Optimism.",
    },
    {
      icon: "🌐",
      title: "Scope of Influence",
      description:
        "This parameter assesses the breadth of the HCC impact within the Optimism ecosystem, including the range of areas or activities they influence.",
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      description:
        "This parameter evaluates how actively the HCC interacts with the community, including gathering feedback, holding public meetings, and providing updates.",
    },
    {
      icon: "🔄",
      title: "Operational Independence",
      description:
        "This parameter measures the degree of autonomy the HCC has in its operations, including budget control, decision-making processes, and procedural oversight.",
    },
    {
      icon: "🗳️",
      title: "Voting Power",
      description:
        "This parameter assesses the extent of voting authority held by the HCC members, including the ability to approve or reject proposals.",
    },
    {
      icon: "🚫",
      title: "Veto Power",
      description:
        "This parameter evaluates whether the HCC has the authority to veto or reject decisions made by other governance bodies.",
    },
  ];

  const steps = [
    {
      title: "Enter Your Email:",
      icon: "📧",
      description:
        "Please provide your email address to proceed. This will allow us to save your configurations and results.",
    },
    {
      title: "Set Weights for Parameters:",
      icon: "⚖️",
      description:
        "Adjust the weightage for each of the six parameters. The total weight must add up to 100%.",
    },
    {
      title: "Assign Scores:",
      icon: "⭐",
      description:
        "For each HCC, assign a score (0-5) for each parameter based on your assessment.",
      sublist: [
        {
          title: "Score Interpretation:",
          items: [
            {
              title: "0:",
              icon: "🚫",
              description:
                "Indicates no influence or power in the given parameter.",
            },
            {
              title: "5:",
              icon: "💪",
              description:
                "Indicates maximum influence or power in the given parameter.",
            },
          ],
        },
      ],
    },
    {
      title: "Calculate Shares:",
      icon: "📊",
      description:
        'Once all weights and scores are set, click on the "Calculate Share" button to see the results.',
    },
    {
      title: "Review Results:",
      icon: "📝",
      description:
        "The results will display the calculated share percentages for each HCC. You can modify the weights and scores as needed and recalculate.",
    },
  ];
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 divouter">
      <div className="p-8 rounded-lg  w-full max-w-lg outerdiv">
        <div className="whole-intruction-div">

        <div className="instructiondiv">
          <h2 className="text-xl font-semibold">Instructions 📋</h2>
        </div>
        <div className="p-6">
          <p className="mb-4">
            Welcome to the HCC Influence Analyzer! 🌟 We would like to collect
            this data to calculate the influence of different Houses, Councils,
            and Committees (HCC) in the Optimism ecosystem.{" "}
            <img
              src={optimismEmoji}
              alt="Optimism"
              style={{
                width: "1.5em",
                height: "1.5em",
                verticalAlign: "middle",
              }}
            />
          </p>
          <p className="mb-4 text-red-500 font-semibold">
            <strong>
              For optimal functionality, we recommend using this application on
              a laptop or desktop computer. 💻
            </strong>
          </p>

          <div style={{ marginBottom: "16px" }}>
            <h5 className="text-lg font-semibold mb-2">
              Parameters Descriptions:
            </h5>
          </div>
          <ul className="list-disc pl-5 mb-4">
            {parameterDescriptions.map(({ icon, title, description }) => (
              <li key={title} className="mb-2">
                <strong>
                  {icon} {title}:
                </strong>
                <br />
                <span style={{ marginLeft: "20px" }}>{description}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginBottom: "16px" }}>
            <h5 className="text-lg font-semibold mb-2">
              Getting Started with the HCC Influence Calculator:
            </h5>
          </div>
          <ol className="list-decimal pl-5 mb-4">
            {steps.map(({ title, icon, description, sublist }, index) => (
              <li key={index} className="mb-2">
                {icon}{" "}<strong>{title}</strong> 
                <span style={{ marginLeft: "10px" }}>{description}</span>
                {sublist && (
                  <ul className="list-disc pl-5 mb-4 mt-2">
                    {sublist.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <strong>{sub.title}</strong>
                        <ul className="list-disc pl-5 mt-2">
                          {sub.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <strong>{item.title}</strong> {item.icon}
                              <span style={{ marginLeft: "10px" }}>
                                {item.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          <div style={{ marginBottom: "16px" }}>
            <h5 className="text-lg font-semibold mb-2">Enter your Email:</h5>
          </div>
          <div className="mb-4 inpputdiv">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full p-2 border rounded ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {emailError && (
              <p className="text-red-500 mt-2 emailerror">{emailError}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t submitbtn">
          <button
            onClick={handleContinue}
            className="continuebutton"
          >
            Continue 
          </button>
        </div>
      </div>
      </div>

    </div>
  );
};

export default Instructions;