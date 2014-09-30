// disease states with parameters
var diseases = {
    "Perfect": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 1.00, daysMin: 36500, daysMax: 36500 },
    },
    "Recurrent": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.10, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.1, daysMin: 36500, daysMax: 36500 }
    },
    "Bacterial": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 3, daysMax: 7 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.35, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 7, daysMax: 14 }
    },
    "Rhinovirus": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.10, daysMin: 2, daysMax: 5 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.35, daysMin: 7, daysMax: 10 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    "Influenza": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.10, daysMin: 1, daysMax: 4 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 5, daysMax: 10 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    "Chicken Pox": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 10, daysMax: 21 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.75, daysMin: 4, daysMax: 7 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    "Ebola": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.05, daysMin: 2, daysMax: 21 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    "HIV": {
        // http://www.cdc.gov/hiv/policies/law/risk.html
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 14, daysMax: 28 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.0138, daysMin: 36500, daysMax: 36500 },
        CONVALESCENT: { name: "CONVALESCEN T", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    "HPV": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 7, daysMax: 14 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.60, daysMin: 180, daysMax: 540 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.00, recurrence: 0.00, daysMin: 1500, daysMax: 6000 }
    },
    "HSV-1": {
        // http://www.patient.co.uk/doctor/herpes-simplex-genital
        // http://en.wikipedia.org/wiki/Herpes_simplex
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 2, daysMax: 12 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.50, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.05, recurrence: 0.003, daysMin: 36500, daysMax: 36500 }
    },
    "HSV-2": {
        HEALTHY: { name: "HEALTHY", color: "#FFFFFF", susceptible: true, contagious: 0.00 },
        INFECTED: { name: "INFECTED", color: "#FFC0C0", susceptible: false, contagious: 0.00, daysMin: 2, daysMax: 12 },
        CLINICAL: { name: "CLINICAL", color: "#FF0000", susceptible: false, contagious: 0.15, daysMin: 7, daysMax: 14 },
        CONVALESCENT: { name: "CONVALESCENT", color: "#800000", susceptible: false, contagious: 0.05, recurrence: 0.01111, daysMin: 36500, daysMax: 36500 }
    }
};

var disease;
