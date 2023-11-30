import { Prosit } from "@/types/prosit";

describe("prosit form filling", () => {
	let prositData: Prosit;
	beforeEach(() => {
		cy.viewport(1920, 1080);
		cy.visit("/");
		cy.fixture("prosit.json").then((prosit) => {
			prositData = prosit;
		});
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test
			return false;
		});
	});

	it("fill prosit form", () => {
		context("fill informations", () => {
			cy.get("input[name=titre]").type(prositData.titre);
			cy.get("input[name=lien]").type(prositData.lien);
			cy.get("input[name=generalisation]").type(prositData.generalisation);
			cy.get("textarea[name=contexte]").type(prositData.contexte);

			cy.get("input[name=animateur]").type(prositData.animateur);
			cy.get("input[name=scribe]").type(prositData.scribe);
			cy.get("input[name=gestionnaire]").type(prositData.gestionnaire);
			cy.get("input[name=secretaire]").type(prositData.secretaire);
		});

		context("fill mots clés", () => {
			cy.get('[href="/mots-clefs"]').click();

			for (const motClef of prositData.motsCles) {
				cy.get("textarea[name=motClef]").type(motClef);
				cy.get("button[type=submit]").click();
			}
		});

		context("fill contraintes", () => {
			cy.get('[href="/contraintes"]').click();

			for (const contrainte of prositData.contraintes) {
				cy.get("textarea[name=contrainte]").type(contrainte);
				cy.get("button[type=submit]").click();
			}
		});

		context("fill problematiques", () => {
			cy.get('[href="/problematiques"]').click();

			for (const problematique of prositData.problematiques) {
				cy.get("textarea[name=problematique]").type(problematique);
				cy.get("button[type=submit]").click();
			}
		});

		context("fill pistes de solutions", () => {
			cy.get('[href="/pistes-de-solution"]').click();

			for (const pisteDeSolution of prositData.pistesDeSolutions) {
				cy.get("textarea[name=pisteDeSolution]").type(pisteDeSolution);
				cy.get("button[type=submit]").click();
			}
		});

		context("fill livrables", () => {
			cy.get('[href="/livrables"]').click();

			for (const livrable of prositData.livrables) {
				cy.get("textarea[name=livrable]").type(livrable);
				cy.get("button[type=submit]").click();
			}
		});

		context("fill plan d'action", () => {
			cy.get('[href="/plan-d-action"]').click();

			for (const etape of prositData.planDAction) {
				cy.get("textarea[name=etape]").type(etape.content);
				cy.get("button[type=submit]").click();
			}
		});

		context("assert if values persisted", () => {
			cy.reload();

			cy.visit("/");

			cy.get("input[name=titre]").should("have.value", prositData.titre);
			cy.get("input[name=lien]").should("have.value", prositData.lien);
			cy.get("input[name=generalisation]").should(
				"have.value",
				prositData.generalisation,
			);
			cy.get("textarea[name=contexte]").should(
				"have.value",
				prositData.contexte,
			);

			cy.get("input[name=animateur]").should(
				"have.value",
				prositData.animateur,
			);
			cy.get("input[name=scribe]").should("have.value", prositData.scribe);
			cy.get("input[name=gestionnaire]").should(
				"have.value",
				prositData.gestionnaire,
			);
			cy.get("input[name=secretaire]").should(
				"have.value",
				prositData.secretaire,
			);

			cy.get('[href="/mots-clefs"]').click();
			cy.wait(1000);

			cy.get("#editable-item-list-motsCles").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.eq(0)
					.children()
					.eq(0)
					.should("have.text", `-${prositData.motsCles[index]}`);
			});

			cy.get('[href="/contraintes"]').click();
			cy.wait(1000);

			cy.get("#editable-item-list-contraintes").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.eq(0)
					.children()
					.eq(0)
					.should("have.text", `-${prositData.contraintes[index]}`);
			});

			cy.get('[href="/problematiques"]').click();
			cy.wait(1000);

			cy.get("#editable-item-list-problematiques").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.eq(0)
					.children()
					.eq(0)
					.should("have.text", `-${prositData.problematiques[index]}`);
			});

			cy.get('[href="/pistes-de-solution"]').click();
			cy.wait(1000);

			cy.get("#editable-item-list-pistesDeSolutions").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.eq(0)
					.children()
					.eq(0)
					.should("have.text", `-${prositData.pistesDeSolutions[index]}`);
			});

			cy.get('[href="/livrables"]').click();
			cy.wait(1000);

			cy.get("#editable-item-list-livrables").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.eq(0)
					.children()
					.eq(0)
					.should("have.text", `-${prositData.livrables[index]}`);
			});

			cy.get('[href="/plan-d-action"]').click();
			cy.wait(1000);

			cy.get("#editable-item-list-plan-d-action").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.eq(0)
					.children()
					.eq(0)
					.should(
						"have.text",
						index + 1 + prositData.planDAction[index].content,
					);
			});
		});

		context("presentation mode read the values", () => {
			cy.visit("/presentation");

			cy.get("#titreProsit").should(
				"have.text",
				`Prosit : ${prositData.titre}`,
			);
			cy.get("#texte-contexte").should("have.text", prositData.contexte);
			cy.get("#texte-generalisation").should(
				"have.text",
				prositData.generalisation,
			);

			cy.get("#liste-motsClefs").each((item, index) => {
				//the child contains a h3 and a button
				cy.wrap(item)
					.children()
					.children()
					.children()
					.should("have.text", `-${prositData.planDAction[index].content}`);
			});
		});
	});
});
