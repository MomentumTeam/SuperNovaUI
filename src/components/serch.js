import React from 'react';

class Serch extends React.Component {





    render() {
        return (
            <div class="search-row">
                <div class="text-field-form">
                    <form>
                        <fieldset>
                            <div class="form-wrap" spellcheck="false">
                                <div>
                                    <legend><span class="for-screnReader">פרטים כלליים</span>
                                    </legend>
                                </div>
                                <div class="display-flex input-unit-wrap">
                                    <div class="input-unit-regular">
                                        <label class="display-non" class="display-non"
                                            for="5000">שם/מ"א/ת"ז</label>
                                        <input id="5000" class="w-xl" type="text"
                                            required="required" placeholder="שם/מ''א/ת''ז " />
                                        <span class="filling-error">שגיאה
                                            במילוי השדה</span>
                                    </div>
                                    <div class="input-unit-regular">
                                        <label class="display-non" for="5011">יחידה</label>
                                        <input id="5011" type="text" required="required"
                                            placeholder="יחידה" />
                                        <span class="filling-error">שגיאה
                                            במילוי השדה</span>
                                    </div>
                                    <div class="input-unit-regular">
                                        <label class="display-non" for="5012">צוות</label>
                                        <input id="5012" class="w-xs" type="text"
                                            required="required" placeholder="צוות" />
                                        <span class="filling-error">שגיאה
                                            במילוי השדה</span>
                                    </div>
                                    <div class="input-unit-regular">
                                        <label class="display-non" class="display-non"
                                            for="5013">כותרת תפקיד</label>
                                        <input id="5013" class="w-l" type="text" required="required"
                                            placeholder="כותרת תפקיד " />
                                        <span class="filling-error">שגיאה
                                            במילוי השדה</span>
                                    </div>
                                    <div class="input-unit-regular">
                                        <label class="display-non" for="5014">ריגול</label>
                                        <input id="5014" type="text" required="required"
                                            placeholder="ריגול" />
                                        <span class="filling-error">שגיאה
                                            במילוי השדה</span>
                                    </div>
                                    <div
                                        class="input-unit-regular input-unit-search">
                                        <label class="display-non" for="5015">חיפוש</label>
                                        <input id="5015" class="w-xxl" type="search"
                                            required="required" placeholder="חיפוש" />
                                        <span class="filling-error">שגיאה
                                            במילוי השדה</span>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}



export default Serch
