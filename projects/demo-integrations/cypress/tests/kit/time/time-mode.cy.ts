import {DemoPath} from 'projects/demo/src/app/app.routes';

describe('Time', () => {
    describe('Mode', () => {
        describe('HH:MM', () => {
            beforeEach(() => {
                cy.visit(`/${DemoPath.Time}/API?mode=HH:MM`);
                cy.get('#demoContent input').should('be.visible').first().as('input');
            });

            describe('Typing new character overwrite character after cursor', () => {
                it('new character is different from next one', () => {
                    cy.get('@input')
                        .type('2359')
                        .type('{moveToStart}')
                        .type('00')
                        .should('have.value', '00:59')
                        .should('have.prop', 'selectionStart', '00:'.length)
                        .should('have.prop', 'selectionEnd', '00:'.length)
                        .type('00')
                        .should('have.value', '00:00')
                        .should('have.prop', 'selectionStart', '00:00'.length)
                        .should('have.prop', 'selectionEnd', '00:00'.length);
                });

                it('moves cursor behind next character if new character is the same with the next one', () => {
                    cy.get('@input')
                        .type('0259')
                        .type('{moveToStart}{rightArrow}')
                        .type('2')
                        .should('have.value', '02:59')
                        .should('have.prop', 'selectionStart', '02:'.length)
                        .should('have.prop', 'selectionEnd', '02:'.length);
                });
            });

            describe('Select range and press new digit', () => {
                it('|23|:59 => Type 1 => 1|0:59', () => {
                    cy.get('@input')
                        .type('235959')
                        .should('have.value', '23:59')
                        .realPress([
                            ...Array(':59'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('23'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('1')
                        .should('have.value', '10:59')
                        .should('have.prop', 'selectionStart', 1)
                        .should('have.prop', 'selectionEnd', 1);
                });

                it('|23|:59 => Type 0 => 0|0:59', () => {
                    cy.get('@input')
                        .type('235959')
                        .should('have.value', '23:59')
                        .realPress([
                            ...Array(':59'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('23'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('0')
                        .should('have.value', '00:59')
                        .should('have.prop', 'selectionStart', 1)
                        .should('have.prop', 'selectionEnd', 1);
                });
            });
        });

        describe('HH:MM:SS', () => {
            beforeEach(() => {
                cy.visit(`/${DemoPath.Time}/API?mode=HH:MM:SS`);
                cy.get('#demoContent input').should('be.visible').first().as('input');
            });

            describe('Typing new character overwrite character after cursor', () => {
                it('new character is different from next one', () => {
                    cy.get('@input')
                        .type('235959')
                        .type('{moveToStart}')
                        .type('0')
                        .should('have.value', '03:59:59')
                        .should('have.prop', 'selectionStart', '0'.length)
                        .should('have.prop', 'selectionEnd', '0'.length)
                        .type('000')
                        .should('have.value', '00:00:59')
                        .should('have.prop', 'selectionStart', '00:00:'.length)
                        .should('have.prop', 'selectionEnd', '00:00:'.length)
                        .type('00')
                        .should('have.value', '00:00:00')
                        .should('have.prop', 'selectionStart', '00:00:00'.length)
                        .should('have.prop', 'selectionEnd', '00:00:00'.length);
                });

                it('moves cursor behind next character if new character is the same with the next one', () => {
                    cy.get('@input')
                        .type('02:59:59')
                        .type('{moveToStart}')
                        .type('{rightArrow}'.repeat('02:'.length))
                        .type('5')
                        .should('have.value', '02:59:59')
                        .should('have.prop', 'selectionStart', '02:5'.length)
                        .should('have.prop', 'selectionEnd', '02:5'.length);
                });
            });

            describe('Select range and press new digit', () => {
                it('23:|59|:59 => Type 2 => 23:2|0:59', () => {
                    cy.get('@input')
                        .type('235959')
                        .should('have.value', '23:59:59')
                        .realPress([
                            ...Array(':59'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('59'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('2')
                        .should('have.value', '23:20:59')
                        .should('have.prop', 'selectionStart', '23:2'.length)
                        .should('have.prop', 'selectionEnd', '23:2'.length);
                });

                it('23:|59|:59 => Type 0 => 23:0|0:59', () => {
                    cy.get('@input')
                        .type('235959')
                        .should('have.value', '23:59:59')
                        .realPress([
                            ...Array(':59'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('59'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('0')
                        .should('have.value', '23:00:59')
                        .should('have.prop', 'selectionStart', '23:0'.length)
                        .should('have.prop', 'selectionEnd', '23:0'.length);
                });
            });
        });

        describe('HH:MM:SS.MSS', () => {
            beforeEach(() => {
                cy.visit(`/${DemoPath.Time}/API?mode=HH:MM:SS.MSS`);
                cy.get('#demoContent input').should('be.visible').first().as('input');
            });

            describe('Typing new character overwrite character after cursor', () => {
                it('new character is different from next one', () => {
                    cy.get('@input')
                        .type('235959999')
                        .type('{moveToStart}')
                        .type('0')
                        .should('have.value', '03:59:59.999')
                        .should('have.prop', 'selectionStart', '0'.length)
                        .should('have.prop', 'selectionEnd', '0'.length)
                        .type('000')
                        .should('have.value', '00:00:59.999')
                        .should('have.prop', 'selectionStart', '00:00:'.length)
                        .should('have.prop', 'selectionEnd', '00:00:'.length)
                        .type('00')
                        .should('have.value', '00:00:00.999')
                        .should('have.prop', 'selectionStart', '00:00:00.'.length)
                        .should('have.prop', 'selectionEnd', '00:00:00.'.length)
                        .type('0')
                        .should('have.value', '00:00:00.099')
                        .should('have.prop', 'selectionStart', '00:00:00.0'.length)
                        .should('have.prop', 'selectionEnd', '00:00:00.0'.length);
                });

                it('moves cursor behind next character if new character is the same with the next one', () => {
                    cy.get('@input')
                        .type('02:59:59.999')
                        .type('{moveToStart}')
                        .type('{rightArrow}'.repeat('02:59:59'.length))
                        .type('9')
                        .should('have.value', '02:59:59.999')
                        .should('have.prop', 'selectionStart', '02:59:59.9'.length)
                        .should('have.prop', 'selectionEnd', '02:59:59.9'.length);
                });
            });

            describe('Select range and press new digit', () => {
                it('23:|59|:59.999 => Type 2 => 23:2|0:59.999', () => {
                    cy.get('@input')
                        .type('235959999')
                        .should('have.value', '23:59:59.999')
                        .realPress([
                            ...Array(':59.999'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('59'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('2')
                        .should('have.value', '23:20:59.999')
                        .should('have.prop', 'selectionStart', '23:2'.length)
                        .should('have.prop', 'selectionEnd', '23:2'.length);
                });

                it('23:|59|:59.999 => Type 0 => 23:0|0:59.999', () => {
                    cy.get('@input')
                        .type('235959999')
                        .should('have.value', '23:59:59.999')
                        .realPress([
                            ...Array(':59.999'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('59'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('0')
                        .should('have.value', '23:00:59.999')
                        .should('have.prop', 'selectionStart', '23:0'.length)
                        .should('have.prop', 'selectionEnd', '23:0'.length);
                });
            });
        });
    });
});
