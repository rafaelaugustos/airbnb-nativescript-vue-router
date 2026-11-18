"""Real adb/UIAutomator input against an already installed, fresh demo app.

ANDROID_SERIAL selects the dedicated emulator. This driver never clears app data.
"""
import json
import os
import pathlib
import re
import subprocess
import time
import xml.etree.ElementTree as ET

SERIAL = os.environ['ANDROID_SERIAL']
ADB = os.environ.get('ADB', 'adb')
OUT = pathlib.Path(os.environ.get('OUT', '/tmp/airbnb-showcase-android'))
OUT.mkdir(parents=True, exist_ok=True)
steps = []


def adb(*args, timeout=20):
    return subprocess.check_output([ADB, '-s', SERIAL, *args], timeout=timeout)


def tree():
    for attempt in range(3):
        try:
            adb('shell', 'uiautomator', 'dump', '/sdcard/airbnb-showcase.xml', timeout=12)
            raw = adb('exec-out', 'cat', '/sdcard/airbnb-showcase.xml')
            return ET.fromstring(raw)
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError, ET.ParseError):
            if attempt == 2:
                raise
            time.sleep(0.4)


def find(root, label):
    expected = label.casefold()
    return next((node for node in root.iter('node')
                 if expected in (node.get('text', '').casefold(), node.get('content-desc', '').casefold())
                 or node.get('content-desc', '').casefold().startswith(expected + '. ')), None)


def wait(label):
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        node = find(tree(), label)
        if node is not None:
            return node
        time.sleep(0.3)
    raise AssertionError(f'Missing: {label}')


def tap(label, scroll=False):
    if scroll:
        for _ in range(4):
            if find(tree(), label) is not None:
                break
            adb('shell', 'input', 'swipe', '530', '1750', '530', '700', '450')
    node = wait(label)
    x1, y1, x2, y2 = map(int, re.findall(r'\d+', node.get('bounds', '')))
    assert x2 > x1 and y2 > y1, (label, node.attrib)
    assert node.get('enabled') != 'false', (label, 'disabled')
    adb('shell', 'input', 'tap', str((x1 + x2) // 2), str((y1 + y2) // 2))
    time.sleep(0.4)
    steps.append(label)
    print(label, flush=True)


def screenshot(name):
    (OUT / f'{name}.png').write_bytes(adb('exec-out', 'screencap', '-p'))


try:
    adb('shell', 'am', 'start', '-n', 'org.nativescript.airbnbns/com.tns.NativeScriptActivity')
    tap('Mensagens')
    wait('A serra está chamando')
    screenshot('messages')
    tap('Abrir convite')
    tap('Cancelar login')
    wait('A serra está chamando')
    tap('Abrir convite')
    tap('Entrar e continuar')
    wait('Sua viagem')
    screenshot('trip')
    tap('Editar viagem', scroll=True)
    tap('11–14 de dez. · 3 noites')
    tap('Alterar hóspedes', scroll=True)
    tap('Aumentar hóspedes')
    tap('Cancelar hóspedes')
    wait('1 hóspede')
    tap('Alterar hóspedes')
    tap('Aumentar hóspedes')
    tap('Salvar hóspedes')
    wait('2 hóspedes')
    tap('Histórico da navegação')
    tap('Minhas viagens')
    wait('Descartar alterações?')
    screenshot('unsaved-guard')
    tap('Continuar editando')
    tap('Salvar alterações')
    wait('Sua viagem')
    wait('11–14 de dez.')
    wait('2 hóspedes')
    tap('Revisar reserva')
    tap('Confirmar reserva demo')
    wait('CONFIRMADA NO DEMO')
    screenshot('confirmed')
    tap('Editar viagem', scroll=True)
    tap('18–23 de dez. · 5 noites')
    tap('Histórico da navegação')
    tap('Minhas viagens')
    tap('Descartar')
    wait('Viagens')
    tap('Perfil')
    tap('Ver registro de navegação', scroll=True)
    wait('Veja o caminho percorrido')
    screenshot('diagnostics')
    tap('Voltar')
    tap('Sair da conta de demonstração', scroll=True)
    wait('Entrar no demo')
    tap('Mensagens')
    tap('Abrir convite')
    wait('Entrar e continuar')
    tap('Cancelar login')
    wait('A serra está chamando')
    (OUT / 'result.json').write_text(json.dumps({'passed': True, 'steps': steps}, ensure_ascii=False, indent=2))
except Exception:
    screenshot('failure')
    (OUT / 'failure.xml').write_bytes(ET.tostring(tree(), encoding='utf-8'))
    raise
