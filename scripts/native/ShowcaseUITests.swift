import XCTest

final class ShowcaseUITests: XCTestCase {
    let app = XCUIApplication(bundleIdentifier: "org.nativescript.airbnbns")

    func tap(_ name: String) {
        let button = app.buttons[name].firstMatch
        XCTAssertTrue(button.waitForExistence(timeout: 15), "Missing \(name)\n\(app.debugDescription)")
        if !button.isHittable {
            for _ in 0..<4 {
                app.scrollViews.firstMatch.swipeUp()
                if button.isHittable { break }
            }
        }
        XCTAssertTrue(button.isHittable, "Not hittable: \(name)\n\(app.debugDescription)")
        button.tap()
    }

    func tab(_ name: String) {
        let button = app.tabBars.buttons.matching(NSPredicate(format: "label BEGINSWITH %@", name)).firstMatch
        XCTAssertTrue(button.waitForExistence(timeout: 15), app.debugDescription)
        button.tap()
    }

    func text(_ name: String) {
        XCTAssertTrue(app.staticTexts[name].firstMatch.waitForExistence(timeout: 15), "Missing \(name)\n\(app.debugDescription)")
    }

    func shot(_ name: String) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    func testInvitationBookingHistoryAndDiagnostics() {
        continueAfterFailure = false
        app.launch()
        tab("Mensagens")
        text("A serra está chamando")
        shot("01-messages")

        // Cancelling authentication must leave the invitation available.
        tap("Abrir convite")
        text("Sua viagem está esperando por você")
        shot("02-login")
        tap("Cancelar login")
        text("A serra está chamando")
        tap("Abrir convite")
        tap("Entrar e continuar")
        text("Sua viagem")
        shot("03-trip")

        tap("Editar viagem")
        tap("11–14 de dez. · 3 noites")
        tap("Alterar hóspedes")
        tap("Aumentar hóspedes")
        tap("Cancelar hóspedes")
        text("1 hóspede")
        tap("Alterar hóspedes")
        tap("Aumentar hóspedes")
        tap("Salvar hóspedes")
        text("2 hóspedes")

        // History selection must use the real leave guard, including refusal.
        tap("Histórico da navegação")
        tap("Minhas viagens")
        XCTAssertTrue(app.alerts["Descartar alterações?"].waitForExistence(timeout: 8), app.debugDescription)
        shot("04-unsaved-guard")
        tap("Continuar editando")
        text("2 hóspedes")
        tap("Salvar alterações")
        text("Sua viagem")
        text("11–14 de dez.")
        text("2 hóspedes")

        tap("Revisar reserva")
        shot("05-reservation")
        tap("Confirmar reserva demo")
        text("CONFIRMADA NO DEMO")
        shot("06-confirmed")

        // Reopening the editor and discarding via history removes both entries.
        tap("Editar viagem")
        tap("18–23 de dez. · 5 noites")
        tap("Histórico da navegação")
        tap("Minhas viagens")
        tap("Descartar")
        text("Viagens")
        XCTAssertFalse(app.buttons["Salvar alterações"].exists)

        tab("Perfil")
        tap("Ver registro de navegação")
        text("Veja o caminho percorrido")
        shot("07-diagnostics")
        tap("← Anterior")
        tap("Copiar JSON para o visualizador")
        XCTAssertTrue(app.buttons["JSON copiado ✓"].waitForExistence(timeout: 5))
        tap("Voltar")
        tap("Sair da conta de demonstração")
        XCTAssertTrue(app.buttons["Entrar no demo"].waitForExistence(timeout: 10), app.debugDescription)

        tab("Mensagens")
        tap("Abrir convite")
        XCTAssertTrue(app.buttons["Entrar e continuar"].waitForExistence(timeout: 10), app.debugDescription)
        tap("Cancelar login")
        text("A serra está chamando")
    }

    func testCatalogPreparationAndConversationPersistence() {
        continueAfterFailure = false
        app.launch()
        tab("Explorar")
        let card = app.buttons["Ver Casa com piscina em Tortuga, Guarujá, São Paulo"].firstMatch
        XCTAssertTrue(card.waitForExistence(timeout: 15), app.debugDescription)
        card.tap()
        XCTAssertTrue(app.buttons["Reservar"].waitForExistence(timeout: 15), app.debugDescription)
        shot("08-prepared-accommodation")
        tap("Voltar")
        tab("Mensagens")
        tap("Conversar com Marina")
        if app.buttons["Entrar e continuar"].waitForExistence(timeout: 3) { tap("Entrar e continuar") }
        text("Marina")
        let field = app.textFields["Escreva uma mensagem"]
        XCTAssertTrue(field.waitForExistence(timeout: 5), app.debugDescription)
        field.tap()
        field.typeText("Vamos chegar as 16h.\n")
        text("Vamos chegar as 16h.")
        shot("09-conversation")
        app.terminate()
        app.launch()
        text("Vamos chegar as 16h.")
        tap("Voltar")
        tab("Perfil")
        tap("Sair da conta de demonstração")
        XCTAssertTrue(app.buttons["Entrar no demo"].waitForExistence(timeout: 10), app.debugDescription)
    }

    func testProtectedSystemLink() {
        continueAfterFailure = false
        app.launch()
        tab("Perfil")
        if !app.buttons["Entrar no demo"].waitForExistence(timeout: 2) { tap("Sair da conta de demonstração") }
        app.open(URL(string: "airbnbns://trips/brisa")!)
        tap("Entrar e continuar")
        text("Sua viagem")
        text("Casa com piscina em Ubatuba")
        shot("10-protected-system-link")
    }
}
