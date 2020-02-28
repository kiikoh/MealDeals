const DAYS_IN_SEM = 105;

const MEALS = ["breakfast", "lunch", "dinner"];

let config = {
	breakfast: {
		diningHall: 6.33,
		homemade: 0.4,
		visits: 100
	},
	lunch: {
		diningHall: 13.36,
		homemade: 1.75,
		visits: 5
	},
	dinner: {
		diningHall: 13.36,
		homemade: 2,
		visits: 5
	}
};

let plans = [
	{
		swipes: 20,
		thrifty: 225,
		price: 460
	},
	{
		swipes: 40,
		thrifty: 275,
		price: 740
	},
	{
		swipes: 60,
		thrifty: 350,
		price: 1045
	},
	{
		swipes: 90,
		thrifty: 550,
		price: 1585
	},
	{
		swipes: 120,
		thrifty: 550,
		price: 1860
	},
	{
		swipes: 205,
		thrifty: 550,
		price: 2550
	}
];

function main() {
	let cheapest = 10000;
	let swipeUsage = [0, 0, 0];
	let planName = "none";
	for (let plan of plans) {
		let details = getDetailsForPlan(plan);
		console.log(`The ${plan.swipes} plan will cost $${details.cost}`);
		if (details.cost < cheapest) {
			cheapest = details.cost;
			swipeUsage = details.whenToSwipe;
			planName = plan.swipes;
		}
	}
	console.log(`The best plan for you is the ${planName}. 
                \nYou should swipe ${swipeUsage[0]} times for breakfast,
                \n${swipeUsage[1]} times for lunch and
                \n${swipeUsage[2]} times for dinner`);
}

function getDetailsForPlan(plan) {
	let totalCost = plan.price;
	let swipesUsed = [0, 0, 0];
	let visits = [0, 0, 0];

	//allocate swipes
	for (let i = plan.swipes; i > 0; i--) {
		//which meal to use swipe on
		let meal = getBestSwipeUse(swipesUsed);
		//use the swipe
		visits[MEALS.indexOf(meal)]++;
		swipesUsed[MEALS.indexOf(meal)]++;
	}
	//all swipes have been used
	//now we must buy the remainder of the visits with thrifty
	let thrifty = plan.thrifty;
	for (let i = 0; i < 3; i++) {
		let unpurchased = config[MEALS[i]].visits - swipesUsed[i];
		thrifty -= unpurchased * config[MEALS[i]].diningHall;
	}
	//if there is not enough thrifty it must be added back
	if (thrifty < 0) {
		totalCost += -thrifty;
	}
	//now account for the price of homemade meals
	for (let i = 0; i < 3; i++) {
		let mealsToMake = DAYS_IN_SEM - config[MEALS[i]].visits;
		totalCost += mealsToMake * config[MEALS[i]].homemade;
	}
	return {
		cost: totalCost,
		whenToSwipe: swipesUsed
	};
}

function getBestSwipeUse(usage) {
	let maxSavings = 0;
	let best = "none";
	for (let [index, meal] of MEALS.entries()) {
		if (config[meal].visits > usage[index] && config[meal].diningHall - config[meal].homemade > maxSavings) {
			maxSavings = config[meal].diningHall - config[meal].homemade;
			best = meal;
		}
	}
	return best;
}

main();
