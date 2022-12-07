import {DemoPath} from 'projects/demo/src/app/app.routes';

describe('Time', () => {
    describe('Basic', () => {
        beforeEach(() => {
            cy.visit(`/${DemoPath.Time}/API?mode=HH:MM`);
            cy.get('#demoContent input').should('be.visible').first().as('input');
        });

        describe('basic typing (1 character per keydown)', () => {
            const tests = [
                // [Typed value, Masked value]
                ['1', '1'],
                ['12', '12'],
                ['123', '12:3'],
                ['1234', '12:34'],
            ] as const;

            tests.forEach(([typedValue, maskedValue]) => {
                it(`Type "${typedValue}" => "${maskedValue}"`, () => {
                    cy.get('@input')
                        .type(typedValue)
                        .should('have.value', maskedValue)
                        .should('have.prop', 'selectionStart', maskedValue.length)
                        .should('have.prop', 'selectionEnd', maskedValue.length);
                });
            });
        });

        describe('basic erasing (value = "12:34" & caret is placed after the last value)', () => {
            beforeEach(() => {
                cy.get('@input').type('1234');
            });

            const tests = [
                // [How many times "Backspace"-key was pressed, Masked value]
                [1, '12:3'],
                [2, '12'],
                [3, '1'],
                [4, ''],
            ] as const;

            tests.forEach(([n, maskedValue]) => {
                it(`Backspace x${n} => "${maskedValue}"`, () => {
                    cy.get('@input')
                        .type('{backspace}'.repeat(n))
                        .should('have.value', maskedValue)
                        .should('have.prop', 'selectionStart', maskedValue.length)
                        .should('have.prop', 'selectionEnd', maskedValue.length);
                });
            });

            it('Delete => no value change && no caret index change', () => {
                cy.get('@input')
                    .type('{del}')
                    .should('have.value', '12:34')
                    .should('have.prop', 'selectionStart', '12:34'.length)
                    .should('have.prop', 'selectionEnd', '12:34'.length);
            });
        });

        describe('Editing somewhere in the middle of a value (NOT the last character)', () => {
            beforeEach(() => {
                cy.get('@input').type('1234');
            });

            // TODO BUG!
            it.skip('12:3|4 => Backspace => 12:|04 => Type "5" => 12:5|4', () => {
                cy.get('@input')
                    .focus()
                    .type('{leftArrow}')
                    .should('have.prop', 'selectionStart', '12:3'.length)
                    .should('have.prop', 'selectionEnd', '12:3'.length)
                    .type('{backspace}')
                    .should('have.value', '12:04')
                    .should('have.prop', 'selectionStart', '12:'.length)
                    .should('have.prop', 'selectionEnd', '12:'.length)
                    .type('5')
                    .should('have.value', '12:54')
                    .should('have.prop', 'selectionStart', '12:5'.length)
                    .should('have.prop', 'selectionEnd', '12:5'.length);
            });

            // TODO: BUG!
            it.skip('12|:34 => Backspace => 1|0:34 => Type "1" => 11:|34', () => {
                cy.get('@input')
                    .focus()
                    .type('{leftArrow}'.repeat(':34'.length))
                    .should('have.prop', 'selectionStart', '12'.length)
                    .should('have.prop', 'selectionEnd', '12'.length)
                    .type('{backspace}')
                    .should('have.value', '10:34')
                    .should('have.prop', 'selectionStart', '1'.length)
                    .should('have.prop', 'selectionEnd', '1'.length)
                    .type('1')
                    .should('have.value', '11:34')
                    .should('have.prop', 'selectionStart', '11:'.length)
                    .should('have.prop', 'selectionEnd', '11:'.length);
            });

            // TODO: BUG!
            it.skip('1|2:34 => Backspace => |02:34 => Type "2" => 2|2:34', () => {
                cy.get('@input')
                    .focus()
                    .type('{leftArrow}'.repeat('2:34'.length))
                    .should('have.prop', 'selectionStart', '1'.length)
                    .should('have.prop', 'selectionEnd', '1'.length)
                    .type('{backspace}')
                    .should('have.value', '02:34')
                    .should('have.prop', 'selectionStart', 0)
                    .should('have.prop', 'selectionEnd', 0)
                    .type('2')
                    .should('have.value', '22:34')
                    .should('have.prop', 'selectionStart', 1)
                    .should('have.prop', 'selectionEnd', 1);
            });
        });

        describe('Fixed values', () => {
            it('Press Backspace after fixed value => no value change => move caret to the left', () => {
                cy.get('@input')
                    .type('2359')
                    .type('{leftArrow}'.repeat('59'.length))
                    .should('have.prop', 'selectionStart', '23:'.length)
                    .should('have.prop', 'selectionEnd', '23:'.length)
                    .type('{backspace}')
                    .should('have.value', '23:59')
                    .should('have.prop', 'selectionStart', '23'.length)
                    .should('have.prop', 'selectionEnd', '23'.length);
            });

            it('Press Delete after fixed value => no value change => move caret to the right', () => {
                cy.get('@input')
                    .type('2359')
                    .type('{leftArrow}'.repeat(':59'.length))
                    .should('have.prop', 'selectionStart', '23'.length)
                    .should('have.prop', 'selectionEnd', '23'.length)
                    .type('{del}')
                    .should('have.value', '23:59')
                    .should('have.prop', 'selectionStart', '23:'.length)
                    .should('have.prop', 'selectionEnd', '23:'.length);
            });
        });

        describe('Text selection', () => {
            describe('Select range and press Backspace', () => {
                it('12:|34| => Backspace => 12|', () => {
                    cy.get('@input')
                        .type('1234')
                        .realPress([
                            'Shift',
                            ...Array('34'.length).fill('ArrowLeft'),
                            'Backspace',
                        ]);

                    cy.get('@input')
                        .should('have.value', '12')
                        .should('have.prop', 'selectionStart', '12'.length)
                        .should('have.prop', 'selectionEnd', '12'.length);
                });

                it('1|2:3|4 => Backspace => 1|4', () => {
                    cy.get('@input')
                        .type('1234')
                        .realPress([
                            'ArrowLeft',
                            'Shift',
                            ...Array('2:3'.length).fill('ArrowLeft'),
                            'Backspace',
                        ]);

                    cy.get('@input')
                        .should('have.value', '14')
                        .should('have.prop', 'selectionStart', '1'.length)
                        .should('have.prop', 'selectionEnd', '1'.length);
                });

                // TODO: investigate if it is correct behaviour
                it('|12|:34 => Backspace => Empty string (34 is invalid for hours)', () => {
                    cy.get('@input')
                        .type('1234')
                        .realPress([
                            ...Array(':34'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('12'.length).fill('ArrowLeft'),
                            'Backspace',
                        ]);

                    cy.get('@input')
                        .should('have.value', '')
                        .should('have.prop', 'selectionStart', 0)
                        .should('have.prop', 'selectionEnd', 0);
                });
            });

            describe('Select range and press "Delete"', () => {
                it('23:|59| => Delete => 23|', () => {
                    cy.get('@input')
                        .type('2359')
                        .realPress([
                            'Shift',
                            ...Array('59'.length).fill('ArrowLeft'),
                            'Delete',
                        ]);

                    cy.get('@input')
                        .should('have.value', '23')
                        .should('have.prop', 'selectionStart', '23'.length)
                        .should('have.prop', 'selectionEnd', '23'.length);
                });

                // TODO: BUG!
                it.skip('2|3:5|9 => Delete => 2|', () => {
                    cy.get('@input')
                        .type('2359')
                        .realPress([
                            'ArrowLeft',
                            'Shift',
                            ...Array('3:5'.length).fill('ArrowLeft'),
                            'Delete',
                        ]);

                    cy.get('@input')
                        .should('have.value', '2')
                        .should('have.prop', 'selectionStart', '2'.length)
                        .should('have.prop', 'selectionEnd', '2'.length);
                });

                // TODO: investigate if it is correct behaviour
                it('|23|:59 => Delete => Empty string (59 is invalid for hours)', () => {
                    cy.get('@input')
                        .type('2359')
                        .realPress([
                            ...Array(':59'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('23'.length).fill('ArrowLeft'),
                            'Delete',
                        ]);

                    cy.get('@input')
                        .should('have.value', '')
                        .should('have.prop', 'selectionStart', 0)
                        .should('have.prop', 'selectionEnd', 0);
                });
            });

            describe('Select range and press new digit', () => {
                it('11:|22| => Press 3 => 11:3|', () => {
                    cy.get('@input')
                        .type('1122')
                        .realPress(['Shift', ...Array('22'.length).fill('ArrowLeft')]);

                    cy.get('@input')
                        .type('3')
                        .should('have.value', '11:3')
                        .should('have.prop', 'selectionStart', '11:3'.length)
                        .should('have.prop', 'selectionEnd', '11:3'.length);
                });

                it('1|1:2|2 => Press 3 => 13:|2', () => {
                    cy.get('@input')
                        .type('1122')
                        .realPress([
                            'ArrowLeft',
                            'Shift',
                            ...Array('1:2'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('3')
                        .should('have.value', '13:2')
                        .should('have.prop', 'selectionStart', '13:'.length)
                        .should('have.prop', 'selectionEnd', '13:'.length);
                });

                it('|11|:22 => Press 2 => 2|2:2', () => {
                    cy.get('@input')
                        .type('1122')
                        .realPress([
                            ...Array(':22'.length).fill('ArrowLeft'),
                            'Shift',
                            ...Array('11'.length).fill('ArrowLeft'),
                        ]);

                    cy.get('@input')
                        .type('2')
                        .should('have.value', '22:2')
                        .should('have.prop', 'selectionStart', '2'.length)
                        .should('have.prop', 'selectionEnd', '2'.length);
                });
            });
        });

        describe('Undo', () => {
            it('Select all + Delete => Ctrl + Z', () => {
                cy.get('@input')
                    .type('1743')
                    .type('{selectall}{del}')
                    .should('have.value', '')
                    .type('{ctrl+z}')
                    .should('have.value', '17:43');
            });

            it('11|:22 => Backspace (x2) => Ctrl + Z (x2)', () => {
                cy.get('@input')
                    .type('1122')
                    .type('{leftArrow}'.repeat(':22'.length))
                    .type('{backspace}{backspace}')
                    .should('have.value', '22')
                    .should('have.prop', 'selectionStart', 0)
                    .should('have.prop', 'selectionEnd', 0)
                    .type('{ctrl+z}')
                    .should('have.value', '12:2')
                    .should('have.prop', 'selectionStart', '1'.length)
                    .should('have.prop', 'selectionEnd', '1'.length)
                    .type('{ctrl+z}')
                    .should('have.value', '11:22')
                    .should('have.prop', 'selectionStart', '11'.length)
                    .should('have.prop', 'selectionEnd', '11'.length);
            });

            it('12:|34 => Delete => Cmd + Z', () => {
                cy.get('@input')
                    .type('1234')
                    .type('{leftArrow}{leftArrow}')
                    .type('{del}')
                    .should('have.value', '12:4')
                    .should('have.prop', 'selectionStart', '12:'.length)
                    .should('have.prop', 'selectionEnd', '12:'.length)
                    .type('{cmd+z}')
                    .should('have.value', '12:34')
                    .should('have.prop', 'selectionStart', '12:'.length)
                    .should('have.prop', 'selectionEnd', '12:'.length);
            });
        });

        describe('Redo', () => {
            it('Select all + Delete => Cmd + Z => Cmd + Shift + Z', () => {
                cy.get('@input')
                    .type('1743')
                    .type('{selectall}{del}')
                    .should('have.value', '')
                    .type('{cmd+z}')
                    .should('have.value', '17:43')
                    .type('{cmd+shift+z}')
                    .should('have.value', '');
            });

            it('11|:22 => Backspace (x2) => Ctrl + Z (x2) => Ctrl + Y (x2)', () => {
                cy.get('@input')
                    .type('1122')
                    .type('{leftArrow}'.repeat(':22'.length))
                    .type('{backspace}{backspace}')
                    .type('{ctrl+z}')
                    .type('{ctrl+z}')
                    .type('{ctrl+y}')
                    .type('{ctrl+y}')
                    .should('have.value', '22')
                    .should('have.prop', 'selectionStart', ''.length)
                    .should('have.prop', 'selectionEnd', ''.length);
            });

            it('12:|34 => Delete => Cmd + Z => Ctrl + Y', () => {
                cy.get('@input')
                    .type('1234')
                    .type('{leftArrow}{leftArrow}')
                    .type('{del}')
                    .type('{cmd+z}')
                    .type('{cmd+shift+z}')
                    .should('have.value', '12:4')
                    .should('have.prop', 'selectionStart', '12:'.length)
                    .should('have.prop', 'selectionEnd', '12:'.length);
            });
        });
    });
});
